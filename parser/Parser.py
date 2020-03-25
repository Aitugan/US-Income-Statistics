#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from bs4 import BeautifulSoup
from selenium import webdriver
import requests


# In[ ]:


DRIVERPATH = "C:\\Users\\madiy\\chromedriver_win32\\chromedriver"
class IndeedParse:
    def __init__(self, categories, locations, coordinates=None, pages=1):
        self.categories = categories
        self.locations = locations
        self.coordinates = coordinates
        self.pages = pages
        self.browser = webdriver.Chrome(DRIVERPATH)
        self.browser.set_window_position(0, 0)
        self.all_salaries = {}
        self.find_by_categories(categories, locations)

    def find_by_categories(self, categories, locations):
        for idx, location in enumerate(locations):
            self.all_salaries[location] = {}
            for category in categories:
                salary = self.find_salary(category, location)
                if salary:
                    self.all_salaries[location][category] = self.find_salary(category, location)
            mean = self.find_total_mean_of_categories(categories, location)
            self.all_salaries[location]['Average'] = mean
            print(location)
            if (self.coordinates != None):
                self.all_salaries[location]['Latitude'] = self.coordinates[idx][0]
                self.all_salaries[location]['Longitude'] = self.coordinates[idx][1]
    
    def find_total_mean_of_categories(self, categories, location):
        n = 0
        sum = 0
        for category in categories:
            try:
                if category not in self.all_salaries[location]:
                    continue
                sum += self.all_salaries[location][category]
                n += 1
            except:
                continue
        return sum / n
    
    def find_salary(self, category, location):
        pages_count = self.pages
        all_salaries = []
        
        for i in range(self.pages):
            if i != 0 and (i > 100 or i >= pages_count):
                break
            
            url = 'https://www.indeed.com/jobs?q={}&l={}&start={}0#'.format(category, location, i)
            self.browser.get(url)
            soup = BeautifulSoup(self.browser.page_source, 'lxml')
            
            if i == 0:
                try:
                    pages_count = int(soup.find('div', {'id': 'searchCountPages'}).text.split(' ')[-2].replace(',', '')) // 10
                except:
                    continue
            
            salaries = soup.find_all('span', {'class': 'salaryText'})
            
            for salary in salaries:
                arr = salary.text                           .replace(' a ', ' ')                            .replace(' an ', ' ')                           .replace('$', '')                           .replace(' - ', ' ')                           .replace('\n', '')                           .split(' ')

                salary = 0
                if len(arr) > 2:
                    try:
                        start_salary = float(arr[0].replace(',', ''))
                        end_salary = float(arr[1].replace(',', ''))
                        payout_time = arr[-1]
                        salary = (start_salary + end_salary) / 2
                    except:
                        continue
                else:
                    salary = float(arr[0].replace(',', ''))
                    payout_time = arr[-1]

                if payout_time == 'month':
                    salary *= 12

                elif payout_time == 'hour':
                    salary *= AVG_WORK_TIME * 30 * 12

                all_salaries.append(salary)
        if len(all_salaries) == 0:
            return None
        return self.find_median(all_salaries)
                
    def find_median(self, arr):
        arr = sorted(arr)
        if len(arr) % 2 != 0:
            return arr[len(arr) // 2]
        return (arr[len(arr) // 2 - 1] + arr[len(arr) // 2]) / 2
        


# In[ ]:


categories = ['Marketing', 'Finance', 'Architecture', 'Business Management', 'Communications', 'Education', 'Healthcare',
             'Human Resources', 'Human Services', 'Sales', 'Information Technology']


# In[ ]:


response = requests.get('https://www.latlong.net/category/states-236-14.html')
soup = BeautifulSoup(response.text, 'lxml')
states = []
coordinates = []
for tr in soup.find_all('tr'):
    arr = tr.find_all('td')
    if (len(arr) == 0):
        continue
    states.append(arr[0].a.text.split(',')[0])
    coordinates.append((float(arr[1].text), float(arr[2].text)))
states[states.index('Missouri State')] = 'Missouri'


# In[ ]:


parser = IndeedParse(categories, states, coordinates, 2)


# In[ ]:


parser.all_salaries


# In[ ]:


import json
with open('salaries.json', 'w') as fp:
    json.dump(parser.all_salaries, fp)

