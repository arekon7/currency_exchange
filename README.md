# currency_exchange

Simple currency exchange application. 

Functionality:
* application updates currency rates from server:
	1. at application startup
	2. every 10 minutes
	3. after Update event
* calculates given value in euros to selected currency
* all currencies are sorted in alphabetical order
* all search results are saved in browser cookies

For more information read Task_description.pdf and README.TXT

If executing statically use Mozilla FireFox browser
Chrome not support cookies if executing statically form PC (not from server), so application will work incorrectly.