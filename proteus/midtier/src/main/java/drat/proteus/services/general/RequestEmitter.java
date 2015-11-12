package drat.proteus.services.general;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.util.Map;

/**
 * Created by stevenfrancus on 10/28/15.
 */
public abstract class RequestEmitter {
    private static Client client = ClientBuilder.newBuilder().newClient();
    private String serviceName;
    public RequestEmitter(String serviceName) {
        this.serviceName = serviceName;
    }
    public RestRequest createRequest(String path) {
        RestRequest request = new RestRequest(client);
        request.buildTarget(this.serviceName, path);
        return request;
    }
    public RestRequest createRequest(String path, Map<String, String> queryParams) {
        RestRequest request = new RestRequest(client);
        request.buildTarget(this.serviceName, path, queryParams);
        return request;
    }
    public void destroy() {
       client.close();
    }
}