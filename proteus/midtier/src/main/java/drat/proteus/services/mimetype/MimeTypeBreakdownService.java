package drat.proteus.services.mimetype;

import com.google.gson.Gson;
import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.AbstractRestService;
import drat.proteus.services.general.Item;
import org.wicketstuff.rest.utils.http.HttpMethod;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MimeTypeBreakdownService extends AbstractRestService {
    private static final String FACET_COUNTS_JSON_KEY = "facet_counts";
    private static final String FACET_FIELDS_JSON_KEY = "facet_fields";
    private static final String MIME_TYPE_JSON_KEY = "mimetype";

    private static final String Q_PARAM = "q";
    private static final String WT_PARAM = "wt";
    private static final String FACET_PARAM = "facet";
    private static final String FACET_FIELD_PARAM = "facet.field";

    private static final int DEFAULT_LIMIT = 10;

    public MimeTypeBreakdownService() {
        super(ProteusEndpointConstants.Services.MIME_TYPE_BREAKDOWN);
    }

    public List<Item> getMimeTypes(Integer limit) {
        if(limit == 0) {
            limit = DEFAULT_LIMIT;
        }
        Map<String, String> queryParams = new HashMap<>();
        queryParams.put(Q_PARAM, "*:*");
        queryParams.put(WT_PARAM, "json");
        queryParams.put(FACET_PARAM, "on");
        queryParams.put(FACET_FIELD_PARAM, "mimetype");
        Response solrResponse = this.createRequest(ProteusEndpointConstants.MIME_TYPE_SELECT, queryParams).getResponse(HttpMethod.GET);
        String jsonBody = solrResponse.readEntity(String.class);
        return parseJsonBodyForMimeTypeFacet(jsonBody, limit);
    }

    public List<Item> parseJsonBodyForMimeTypeFacet(String json, int limit) {
        List<Item> mimeTypeBreakdownItems = new ArrayList<Item>();
        Map<String, Object> root = (Map<String,Object>)new Gson().fromJson(json, Map.class);
        Map<String, Object> facetCounts = (Map<String,Object>)root.get(FACET_COUNTS_JSON_KEY);
        Map<String, Object> facetFields = (Map<String, Object>)facetCounts.get(FACET_FIELDS_JSON_KEY);
        ArrayList mimeTypes = (ArrayList)facetFields.get(MIME_TYPE_JSON_KEY);
        int totalCurrentRepoSize = 0;
        for(int i = 0; i < mimeTypes.size()/2; i++) {
            String type = (String)mimeTypes.get(2*i);
            Double mimeTypePopulation = (Double)mimeTypes.get(2*i+1);
            mimeTypeBreakdownItems.add(new MimeTypeBreakdownItem(type, mimeTypePopulation.intValue()));
            totalCurrentRepoSize += mimeTypePopulation;
        }

        for(Item item: mimeTypeBreakdownItems) {
            ((MimeTypeBreakdownItem)item).setRepoSize(totalCurrentRepoSize);
        }
        return (limit < mimeTypeBreakdownItems.size()) ? mimeTypeBreakdownItems.subList(0, limit) : mimeTypeBreakdownItems;
    }
}
