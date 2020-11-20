from bs4 import BeautifulSoup
import requests
from unidecode import unidecode
import json
from sys import argv


class OSUCourseScraper():
    """Defines a class for downloading all course names from the OSU website.

    """
    ABORTING = 'Aborting database update!'
    FILE_NOT_FOUND = 'JSON file not found!'
    JSON_FILE_FORMAT_INVALID = 'JSON file not formatted properly!'
    COURSE_DESCRIPTIONS_URL = 'https://catalog.oregonstate.edu/courses'
    CSS_SELECTOR_FOR_DEPTS = '.az_sitemap >  ul > li > a'
    PREEXISTING_KEY = "Known"
    DATABASE_KEY = 'Coursework'

    def __init__(self, json_filename=None):
        # Get the HTML document page and read it with BeautifulSoup.
        self._source = (requests.get(OSUCourseScraper.COURSE_DESCRIPTIONS_URL).text)
        self._soup = BeautifulSoup(self._source, 'lxml')

        # List of results.
        self._dept_scrapers = self._scrape_departments()

    def _scrape_departments(self):
        # Get the <ul> containing all the department links. Each element is the
        # list of deparments for a specific letter of the alphabet.
        a_tags = self._soup.select(self.CSS_SELECTOR_FOR_DEPTS)
        return [OSUDepartmentScraper(anchor.attrs['href']) for anchor in a_tags]

    @staticmethod
    def _read_json(filename):
        """Read database from json file.

        Parameters
        ----------
        filename: str
            Path to JSON database file.

        Returns
        -------
        dict
            Database. None if can't find file.
        """
        print('Reading from database')
        try:
            with open(filename, 'r') as infile:
                db = json.load(infile)
            return db
        except FileNotFoundError:
            print(OSUCourseScraper.FILE_NOT_FOUND)
            return None
        except json.JSONDecodeError:
            print(OSUCourseScraper.JSON_FILE_FORMAT_INVALID)
            return None

    @staticmethod
    def _write_json(filename, db):
        """Update the database file.

        Parameters
        ----------
        filename: str
            Path to JSON database file.
        db: dict
            Data to use for the database.

        Returns
        -------
        bool
            True if succesfully wrote else False
        """
        print('Writing to database.')
        try:
            with open(filename, 'w') as outfile:
                json.dump(db, outfile, indent=2)
                print(f'\nWrite successful!')
            return True
        except FileNotFoundError:
            print(OSUCourseScraper.FILE_NOT_FOUND)
            print(OSUCourseScraper.ABORTING)
            return False

    def get_preexisting_dict(self, db):
        if type(db) != dict:
            return None

        preexisting = db.get(OSUCourseScraper.PREEXISTING_KEY, None)
        if preexisting is None:
            return None
        elif type(preexisting) != dict:
            return None
        else:
            return preexisting

    def _update_database_from_scraped_coures(self, preexisting):
        """Adds any courses that weren't already present in the database to the
        database. Adds them as a list to db.[OSUCourseScraper.DATABASE_KEY] if
        key did not exist. Otherwise if it did and its value was a list, adds
        any courses that weren't alreaedy present.

        Parameters
        ----------
        db: dict
            Dictionary formed from JSON database.

        Returns
        -------
        None

        """
        known_courses = preexisting.get(OSUCourseScraper.DATABASE_KEY, None)
        success = True

        if known_courses is None:  # No known courses. Use all scraped.
            preexisting[OSUCourseScraper.DATABASE_KEY] = self._get_all_scraped_courses(list)
            OSUCourseScraper._alert_no_previous_courses_found(preexisting)
        elif type(known_courses) == list:  # Update known_courses.
            new_courses = self._merge_courses(known_courses)
            OSUCourseScraper._alert_updating_existing_courses(new_courses)
        else:
            success = False
            raise TypeError  # not a list
        return success

    def _merge_courses(self, known_courses):
        """Add mutates known_courses by adding the courses found from scraping that
        were not already in the database list to said list.

        Parameters
        ----------
        known_courses: list of str
            List of coursework already present in the database list.

        Returns
        -------
        set of str
            Courses that have just been added to the database's list.

        """
        # Determine which courses from the scraping were not already in the
        # database.
        known_set = set(known_courses)
        scraped_set = set(self._get_all_scraped_courses(set))
        scraped_and_not_known = scraped_set - known_set

        # Add said courses to the database by mutating the existing database
        # list. Choose appending over concatentation as the latter causes a new
        # list to be constructed thereby leaving the database list unaltered.
        for course in scraped_and_not_known:
            known_courses.append(course)

        return scraped_and_not_known

    def _get_all_scraped_courses(self, desired_type):
        """Make an iterable of all the courses obtained through scraping.

        Allow specification of return type to avoid redundant conversion from
        list to set or vice versa.

        Parameters
        ----------
        desired_type: type
            Must be either `list` or `type`.

        Returns
        -------
        list or set or str
            All the courses gathered through the department scrapers.

        """
        if desired_type not in (list, set):
            raise TypeError('desired_type must be either '
                            '`list` (for the JSON) or '
                            '`set` (for duplicate removal)')

        # Make the container to store the courses.
        scraped_courses = desired_type()

        # Determine the method needed to add a course to the container.
        ADDING_FUNCTION = {list: list.append, set: set.add}

        # Add the courses to the container
        for scraper in self._dept_scrapers:
            for course in scraper.get_courses():
                ADDING_FUNCTION[desired_type](scraped_courses, course)

        # Notify user how many deptartments and courses were found in the
        # scrape.
        print('',
              f'Departments scraped: {len(self._dept_scrapers)}',
              f'Courses scraped: {len(scraped_courses)}', sep='\n')

        return scraped_courses

    def _alert_no_previous_courses_found(db):
        print('\nNo known coursework found, adding all scraped courses to database.')

    def _alert_updating_existing_courses(new_courses_from_scraping):
        new_course_count = len(new_courses_from_scraping)

        new_course_count_line = (f'Found {new_course_count} new courses'
                                 + ('.' if new_course_count == 0 else ':'))
        new_courses_lines = '\n'.join(new_courses_from_scraping)
        updating_database_line = ('' if len(new_courses_from_scraping) == 0
                                  else 'Added said courses to database.')

        print('\n',
              new_course_count_line,
              new_courses_lines,
              updating_database_line,
              sep='')

    def set_dept_scrapers(self, dept_scrapers):
        """Setter for debugging."""
        self._dept_scrapers = dept_scrapers

    def get_dept_scrapers(self):
        """Getter for debugging."""
        return self._dept_scrapers

    def update_course_in_database(self, database_json):
        """Read the file database_json and add any courses that were not in its
        OSUCourseScraper.DATABASE_KEY value. Assumes that the value is a Python
        list (JS array). If the JSON have the OSUCourseScraper.DATABASE_KEY as
        an attribute in the first place, the method will add one and then add
        the scraped classes as a list (JS array).

        Parameters
        ----------
        database_json: str
            Filename of JSON file to add scraped courses to.

        Returns
        -------
        None

        """
        # Read DB.
        db = OSUCourseScraper._read_json(database_json)

        if db is None:
            print(OSUCourseScraper.ABORTING)
            return

        # Make sure preexisting section exists
        preexisting = self.get_preexisting_dict(db)
        if preexisting is None:
            print('Known database incorrectly formatted.',
                  OSUCourseScraper.ABORTING)
            return

        # Make sure courses in database are up to date
        try:
            update_successful = self._update_database_from_scraped_coures(preexisting)
        except TypeError:
            update_successful = False
            print('db[OSUCourseScraper.DATABASE_KEY] exists but its '
                  'value is not of type list.')

        # Save DB.
        if update_successful:
            OSUCourseScraper._write_json(database_json, db)
            print(f'Wrote to {database_json}!')


class OSUDepartmentScraper():
    """Class responsible for scraping course information for a given department."""
    DEPT_URL_BASE = 'https://catalog.oregonstate.edu'
    CSS_SELECTOR_FOR_COURSES = '.courseblock > h2 > strong'

    def __init__(self, url_suffix):
        """Downloads all course info for a given department page.

        Parameters
        ----------
        url_suffix: str
            url suffix of the form /courses/<DEPT_CODE>

        """
        # Perfom string manipulation on the suffix to get the code.
        self._dept_code = [url_component for url_component in url_suffix.split('/')
                           if url_component != ''][-1]

        # Construct the URL to scrape from.
        self._url = f'{OSUDepartmentScraper.DEPT_URL_BASE}/{url_suffix}'

        # Get the HTML document page and read it with BeautifulSoup.
        self._source = requests.get(self._url).text
        self._soup = BeautifulSoup(self._source, 'lxml')

        # Get course information for each course.
        self._courses = self.scrape_courses()

    def scrape_courses(self):
        """Get all the course information from the department page."""
        print(f'Scraping dept: {self._dept_code}')
        # Strong tags contain the course title.
        strong_tags = self._soup.select(OSUDepartmentScraper.CSS_SELECTOR_FOR_COURSES)
        return [self._process_course_title(tag.text) for tag in strong_tags]

    def _process_course_title(self, title):
        """String manipulation to process the course title with."""
        processing_operations = [
            # Decode persistent ASCII characters.
            unidecode,
            # Remove extra whitespace outside.
            str.strip,
            # Remove extra whitespace inside.
            lambda string: string.replace('  ', ' '),
        ]
        result = title
        for function in processing_operations:
            result = function(result)
        return result

    def get_courses(self):
        """Getter."""
        return self._courses


if __name__ == '__main__':
    if len(argv) > 1:
        osu_scraper = OSUCourseScraper()
        osu_scraper.update_course_in_database(argv[1])
    else:
        print('Please specify JSON file to work with!')
