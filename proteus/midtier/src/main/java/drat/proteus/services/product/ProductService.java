package drat.proteus.services.product;

import drat.proteus.services.general.HttpMethodEnum;
import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.RequestEmitter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.ws.rs.core.Response;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by stevenfrancus on 10/28/15.
 */
public class ProductService extends RequestEmitter {
    private static final String PRODUCT_XML_DEMARCATING_TAG = "item";
    private static final String PRODUCT_TITLE = "title";
    private static final String PRODUCT_DESC = "description";
    private static final String PRODUCT_LINK = "link";
    private static final String PRODUCT_PUB_DATE = "pubDate";
    private static final String PRODUCT_CAS_SOURCE = "cas:source";
    private static final String PRODUCT_SOURCE = "source";
    private static final String PRODUCT_PARAM = "channel";
    public ProductService() {
        super(ProteusEndpointConstants.RSS_FEED_SERVICE);
    }
    public List<ProductItem> getAllRecentProducts() {
        return getRecentProductsByType("ALL");
    }

    public List<ProductItem> getRecentProductsByType(String type) {
        Map<String, String> params = new HashMap<>();
        params.put(PRODUCT_PARAM, type);
        Response response = this.createRequest(ProteusEndpointConstants.RSS_FEED_PRODUCTS, params)
                .getResponse(HttpMethodEnum.GET);
        List<ProductItem> products = null;
        try {
            products = this.convertProductsFromXml(response.readEntity(String.class));
        }
        catch(Exception ioe) {

        }
        return products;
    }

    private List<ProductItem> convertProductsFromXml(String xmlDoc) throws Exception {
        DocumentBuilder dbFactory = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        InputSource is = new InputSource(new StringReader(xmlDoc));
        Document doc = dbFactory.parse(is);
        doc.getDocumentElement().normalize();
        NodeList nodes = doc.getElementsByTagName(PRODUCT_XML_DEMARCATING_TAG);
        List<ProductItem> productItems = new ArrayList<ProductItem>();
        for(int i = 0; i < nodes.getLength(); i++) {
            productItems.add(createProductItem(nodes.item(i)));
        }
        return productItems;
    }

    private ProductItem createProductItem(Node node) {
        if(node instanceof Element) {
            Element element = (Element) node;
            String title = getProductXmlContent(element, PRODUCT_TITLE),
                    description = getProductXmlContent(element, PRODUCT_DESC),
                    link = getProductXmlContent(element, PRODUCT_LINK),
                    pubDate = getProductXmlContent(element, PRODUCT_PUB_DATE),
                    casSource = getProductXmlContent(element, PRODUCT_CAS_SOURCE),
                    source = getProductXmlContent(element, PRODUCT_SOURCE);
            return new ProductItem(title, description, link, pubDate, casSource, source);
        }
        return null;
    }

    private static String getProductXmlContent(Element el, String tagName) {
        return el.getElementsByTagName(tagName).item(0).getTextContent();
    }

    public static void main(String[] args) {
        ProductService productService = new ProductService();
        List<ProductItem> products = productService.getAllRecentProducts();
        for(ProductItem item: products) {
            System.out.println(item.toJson());
        }
    }
}
