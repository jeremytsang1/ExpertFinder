from bs4 import BeautifulSoup
import requests
from unidecode import unidecode
import json
from sys import argv


class OSUCourseScraper():
    """Defines a class for downloading all course names from the OSU website.

    """

    # CONSTANTS
    FILE_NOT_FOUND = 'JSON file not found!'
    COURSE_DESCRIPTIONS_URL = 'https://catalog.oregonstate.edu/courses'
    CSS_SELECTOR_FOR_DEPTS = '.az_sitemap >  ul > li > a'
    DATABASE_KEY = 'courses'

    def __init__(self, json_filename=None):
        # Get the HTML document page and read it with BeautifulSoup.
        self.source = requests.get(OSUCourseScraper.COURSE_DESCRIPTIONS_URL).text
        self.soup = BeautifulSoup(self.source, 'lxml')

        # List of results.
        self.dept_scrapers = self.scrape_departments()

    def scrape_departments(self):
        # Get the <ul> containing all the department links. Each element is the
        # list of deparments for a specific letter of the alphabet.
        a_tags = self.soup.select(self.CSS_SELECTOR_FOR_DEPTS)
        return [OSUDepartmentScraper(anchor.attrs['href']) for anchor in a_tags]

    @staticmethod
    def read_json(filename):
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
        try:
            with open(filename, 'r') as infile:
                db = json.load(infile)
            return db
        except FileNotFoundError:
            print(OSUCourseScraper.FILE_NOT_FOUND)
            return None

    @staticmethod
    def write_json(filename, db):
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
        try:
            with open(filename, 'w') as outfile:
                json.dump(db, outfile)
                print(f'Write successful!')
            return True
        except FileNotFoundError:
            print(OSUCourseScraper.FILE_NOT_FOUND)
            return False

    def update_course_in_database(self, database_json):
        # Read DB.
        db = OSUCourseScraper.read_json(database_json)

        if db is None:
            print('Aborting database update!')
            return

        # Update DB.
        db[OSUCourseScraper.DATABASE_KEY] = self.get_all_courses()

        # Save DB.
        OSUCourseScraper.write_json(database_json, db)
        print(f'Wrote to {database_json}!')

    def get_all_courses(self):
        course_list = []
        for scraper in self.dept_scrapers:
            for course in scraper.get_courses():
                course_list.append(course)
        print(f'Departments found: {len(self.dept_scrapers)}',
              f'Courses found: {len(course_list)}',
              sep='\n')
        return course_list

    def set_dept_scrapers(self, dept_scrapers):
        self.dept_scrapers = dept_scrapers


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
        self.dept_code = [url_component for url_component in url_suffix.split('/')
                          if url_component != ''][-1]

        # Construct the URL to scrape from.
        self.url = f'{OSUDepartmentScraper.DEPT_URL_BASE}/{url_suffix}'

        # Get the HTML document page and read it with BeautifulSoup.
        self.source = requests.get(self.url).text
        self.soup = BeautifulSoup(self.source, 'lxml')

        # Get course information for each course.
        self.courses = self.scrape_courses()

    def scrape_courses(self):
        print(f'Scraping dept: {self.dept_code}')
        # Strong tags contain the course title.
        strong_tags = self.soup.select(OSUDepartmentScraper.CSS_SELECTOR_FOR_COURSES)
        return [self._process_course_title(tag.text) for tag in strong_tags]

    def _process_course_title(self, title):
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
        return self.courses


if __name__ == '__main__':
    if len(argv) > 1:
        osu_scraper = OSUCourseScraper()
        osu_scraper.update_course_in_database(argv[1])
    else:
        print('Please specify JSON file to work with!')
