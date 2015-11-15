package drat.proteus.services.product;

import drat.proteus.services.general.AbstractRestService;
import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.Item;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.wicketstuff.rest.utils.http.HttpMethod;
import org.xml.sax.InputSource;

import javax.ws.rs.core.Response;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseProductService extends AbstractRestService {
    private static final String PRODUCT_XML_DEMARCATING_TAG = "item";
    private static final String PRODUCT_TITLE = "title";
    private static final String PRODUCT_DESC = "description";
    private static final String PRODUCT_LINK = "link";
    private static final String PRODUCT_PUB_DATE = "pubDate";
    private static final String PRODUCT_CAS_SOURCE = "cas:source";
    private static final String PRODUCT_SOURCE = "source";
    private static final String PRODUCT_CHANNEL_PARAM = "channel";
    private static final String PRODUCT_TYPE_ID_PARAM = "id";
    private DocumentBuilder dbFactory;
    public BaseProductService() {
        super(ProteusEndpointConstants.Services.FILE_MANAGER_PRODUCT);
        try {
            dbFactory = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        }
        catch(ParserConfigurationException pce) {
            pce.printStackTrace();
        }
    }

    protected List<Item> getRecentProductsByChannel(String channel) {
        Map<String, String> params = new HashMap<>();
        params.put(PRODUCT_CHANNEL_PARAM, channel);
        return generateProducts(params);
    }

    protected List<Item> getRecentProductsByChannelAndTypeId(String channel, String typeId) {
        Map<String, String> params = new HashMap<>();
        params.put(PRODUCT_CHANNEL_PARAM, channel);
        params.put(PRODUCT_TYPE_ID_PARAM, typeId);
        return generateProducts(params);
    }

    private List<Item> generateProducts(Map<String, String> params) {
        Response response = this.createRequest(ProteusEndpointConstants.FILE_MANAGER_PRODUCTS, params)
                .getResponse(HttpMethod.GET);
        List<Item> products = null;
        try {
            String responseBody = response.readEntity(String.class);
            if(responseBody.length() == 0) { //handles the case when there's no products to analyze
                return new ArrayList<Item>();
            }
            products = this.convertProductsFromXml(response.readEntity(String.class));
        }
        catch(Exception ioe) {
            ioe.printStackTrace();
        }
        return products;
    }

    private List<Item> convertProductsFromXml(String xmlDoc) throws Exception {
        InputSource is = new InputSource(new StringReader(xmlDoc));
        Document doc = this.dbFactory.parse(is);
        doc.getDocumentElement().normalize();
        NodeList nodes = doc.getElementsByTagName(PRODUCT_XML_DEMARCATING_TAG);
        List<Item> productItems = new ArrayList<Item>();
        for(int i = 0; i < nodes.getLength(); i++) {
            ProductItem item = createProductItem(nodes.item(i));
            if(item == null) {
                throw new IllegalStateException("RSS Product Service API Feed Malformed");
            }
            productItems.add(item);
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
            return new ProductItem(title, description, pubDate, link, casSource, source);
        }
        return null; //this should never happen
    }

    private static String getProductXmlContent(Element el, String tagName) {
        return el.getElementsByTagName(tagName).item(0).getTextContent();
    }
}
