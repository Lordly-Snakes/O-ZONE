import re, time, urllib2, urllib

url = "https://cdn1.ozone.ru/multimedia/c400/"
urlString = """https://cdn1.ozone.ru/multimedia/c400/1033180284.jpg;
https://cdn1.ozone.ru/multimedia/c400/1033180283.jpg;
https://cdn1.ozone.ru/multimedia/c400/1027495663.jpg;
https://cdn1.ozone.ru/multimedia/c400/1028469540.jpg;
https://cdn1.ozone.ru/multimedia/c400/1024358491.jpg;
https://cdn1.ozone.ru/multimedia/c400/1024822131.jpg;
https://cdn1.ozone.ru/multimedia/c400/1024822128.jpg;
https://cdn1.ozone.ru/multimedia/c400/1021386685.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026072683.jpg;
https://cdn1.ozone.ru/multimedia/c400/1024928305.jpg;
https://cdn1.ozone.ru/multimedia/c400/1024928306.jpg;
https://cdn1.ozone.ru/multimedia/c400/1021877092.jpg;
https://cdn1.ozone.ru/multimedia/c400/1021877092.jpg;
https://cdn1.ozone.ru/multimedia/c400/1025222877.jpg;
https://cdn1.ozone.ru/multimedia/c400/102538227.jpg;
https://cdn1.ozone.ru/multimedia/c400/1015518726.jpg;
https://cdn1.ozone.ru/multimedia/c400/102518725.jpg;
https://cdn1.ozone.ru/multimedia/c400/1028488609.jpg;
https://cdn1.ozone.ru/multimedia/c400/1028488611.jpg;
https://cdn1.ozone.ru/multimedia/c400/1027006299.jpg;
https://cdn1.ozone.ru/multimedia/c400/1027006301.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026202934.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026202933.jpg;
https://cdn1.ozone.ru/multimedia/c400/1025117257.jpg;
https://cdn1.ozone.ru/multimedia/c400/1025117012.jpg;
https://cdn1.ozone.ru/multimedia/c400/1014472326.jpg;
https://cdn1.ozone.ru/multimedia/c400/1014472325.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026748248.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026748250.jpg;
https://cdn1.ozone.ru/multimedia/c400/1025053907.jpg;
https://cdn1.ozone.ru/multimedia/c400/1026951535.jpg;
https://cdn1.ozone.ru/multimedia/c400/1023840682.jpg;
https://cdn1.ozone.ru/multimedia/c400/1023849642.jpg;
https://cdn1.ozone.ru/multimedia/c400/1011627377.jpg;
https://cdn1.ozone.ru/multimedia/c400/1013975751.jpg;
https://cdn1.ozone.ru/multimedia/c400/1013975799.jpg;
https://cdn1.ozone.ru/multimedia/c400/1015773076.jpg;
https://cdn1.ozone.ru/multimedia/c400/1001559725.jpg;
https://cdn1.ozone.ru/multimedia/c400/1021419099.jpg;
https://cdn1.ozone.ru/multimedia/c400/1023547851.jpg;"""

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
