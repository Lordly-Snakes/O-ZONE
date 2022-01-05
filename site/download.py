import re, time, urllib2, urllib

url = "https://cdn1.ozone.ru/multimedia/c400/"
urlString = """https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css
"""

urls = urlString.split(";")

start = time.time()
o=1
for i in range(len(urls)):
    w =urls[i].split("/")
    name = str(w[len(w)-1])
    resource = urllib.urlopen(urls[i])
    out = open(name, 'wb')
    out.write(resource.read())
    out.close()
print time.time()-start
