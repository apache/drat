package drat.proteus.services.general;

import drat.proteus.services.constants.ProteusEndpointConstants;
import org.wicketstuff.rest.utils.http.HttpMethod;

import javax.ws.rs.client.*;
import javax.ws.rs.core.Response;
import java.util.Map;

public class RestRequest {
    private WebTarget target;
    private Client client;
    public RestRequest(Client client) {
        this.client = client;
    }

    public void buildTarget(String service, String path) {
        this.target = this.client.target(ProteusEndpointConstants.BASE_URL + service).path(path);

    }
    public WebTarget buildTarget(String service, String path, Map<String, String> queryParams) {
        buildTarget(service, path);
        for(String q: queryParams.keySet()) {
            this.target = this.target.queryParam(q, queryParams.get(q));
        }
        return target;
    }
    public RestRequest addQueryParam(String key, Object... value) {
       this.target = this.target.queryParam(key, value);
       return this;
    }

    public Response getResponse(HttpMethod method) {
        Invocation.Builder builder = this.target.request();
        switch(method) {
            case GET: {
                return builder.get();
            }
            case HEAD: {
                return builder.head();
            }
            case DELETE: {
                return builder.delete();
            }
            default: {
                throw new IllegalStateException();
            }
        }
    }
    public Response getResponse(HttpMethod method, Entity entity) {
        Invocation.Builder builder = target.request();
        switch(method) {
            case PUT: {
                return builder.put(entity);
            }
            case POST: {
                return builder.post(entity);
            }
            default: {
                throw new IllegalStateException();
            }
        }
    }
}
