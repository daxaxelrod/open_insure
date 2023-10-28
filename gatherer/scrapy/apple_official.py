import scrapy


class RefurbishediPhoneSpider(scrapy.Spider):
    name = "refurbished_iphone_spider"
    start_urls = ["https://www.apple.com/shop/refurbished/iphone"]

    def parse(self, response):
        # Get all the refurbished iPhone products
        iphone_products = response.css(".product-item")

        # Loop over each product and extract the relevant data
        for product in iphone_products:
            yield {
                "name": product.css("h3::text").get(),
                "price": product.css(".price::text").get(),
                "image_url": product.css("img::attr(src)").get(),
            }
