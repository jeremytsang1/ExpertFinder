from bs4 import BeautifulSoup
import requests
from unidecode import unidecode


class OSUCourseScraper():
    """Defines a class for downloading all course names from the OSU website.

    """

    # CONSTANTS
    COURSE_DESCRIPTIONS_URL = 'https://catalog.oregonstate.edu/courses'
    CSS_SELECTOR_FOR_DEPTS = '.az_sitemap >  ul > li > a'

    def __init__(self, json_filename=None):
        # Get the HTML document page and read it with BeautifulSoup.
        self.source = requests.get(OSUCourseScraper.COURSE_DESCRIPTIONS_URL).text
        self.soup = BeautifulSoup(self.source, 'lxml')

        # List of results.
        self.dept_scrapers = self.scrape_departments()

        # TODO: Write results to file

    def scrape_departments(self):
        # Get the <ul> containing all the department links. Each element is the
        # list of deparments for a specific letter of the alphabet.
        a_tags = self.soup.select(self.CSS_SELECTOR_FOR_DEPTS)
        return [OSUDepartmentScraper(anchor.attrs['href']) for anchor in a_tags]


class OSUDepartmentScraper():
    """Class responsible for scraping course information for a given department."""
    DEPT_URL_BASE = 'https://catalog.oregonstate.edu'
    CSS_SELECTOR_FOR_COURSES = ".courseblock > h2 > strong"

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
        print(f"Scraping dept: {self.dept_code}")
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
    osu_scraper = OSUCourseScraper()
