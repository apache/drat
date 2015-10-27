package drat.proteus.routes;

import drat.proteus.method.DratMethod;
import drat.proteus.status.DratStatus;

import java.util.HashMap;
import java.util.Set;

/**
 * Created by stevenfrancus on 10/20/15.
 */
enum ResourceType {
    PACKAGE, SINGLE_RESOURCE
}
class RouteResource {
    private String route;
    private Class resource;
    private ResourceType type;
    public RouteResource() {
        this.type = ResourceType.SINGLE_RESOURCE;
    }
    public RouteResource(String route) {
        this();
        this.route = route;
    }
    public RouteResource(String route, Class resource) {
        this(route);
        this.resource = resource;
    }
    public RouteResource(String route, Class resource, ResourceType type) {
        this(route, resource);
        this.type = type;
    }
    public String getRoute() {
        return this.route;
    }
    public Class getResource() {
        return this.resource;
    }
    public ResourceType getResourceType() {
        return this.type;
    }
}
public class Routes {
    private static HashMap<String, RouteResource> routes = new HashMap<String, RouteResource>();
    static {
        //use this static block to add new routes for Proteus, and add a comment explaining each route below the add
        add(new RouteResource("/drat", DratMethod.class, ResourceType.SINGLE_RESOURCE));
        /* this endpoint /drat will be used for running DRAT commands in the form of queries with the dirpath for drat and
           the query type as params (e.g. POST /drat?q=go with POST body containing /Users/foobar/Desktop/src will run DRAT's go command on
           the directory /Users/foobar/Desktop/src
         */
        add(new RouteResource("/drat/status", DratStatus.class, ResourceType.SINGLE_RESOURCE));
        /*
            GET /drat/status returns a JSON object containing the current status of
         */
    }


    public static void add(RouteResource resource) {
        if(routes.containsKey(resource.getRoute())) {
            throw new RoutesException("Route already exists: " + resource.getRoute());
        }
        routes.put(resource.getRoute(), resource);
    }
    public static void remove(String path) {
        routes.remove(path);
    }
    public static RouteResource get(String path) {
       RouteResource res = routes.get(path);
       if(res == null) {
           throw new RoutesException("Route does not exist: " + path);
       }
       return res;
    }
    public static Set<String> getAllRoutes() {
        return routes.keySet();
    }
}
