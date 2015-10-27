package drat.proteus.routes;

import drat.proteus.WicketApplication;

public class RoutingHandler {
    private WicketApplication application;
    public RoutingHandler(WicketApplication app) {
        this.application = app;
    }
    //alias for bindingRoutes
    public RoutingHandler bind() {
        return this.bindRoutes();
    }
    public RoutingHandler bindRoutes() {
        for(String route: Routes.getAllRoutes()) {
            createRoute(Routes.get(route));
        }
        return this;
    }
    private void createRoute(RouteResource resource) {
        createRoute(resource.getRoute(), resource.getResource(), resource.getResourceType());
    }
    private void createRoute(String route, Class handlerClass, ResourceType resourceType) {
        if(resourceType == ResourceType.SINGLE_RESOURCE) {
            //this.application.mountPackage(route, handlerClass);
        } else {
            //this.application.mountPage(route, handlerClass);
        }
    }
    private void reloadRoutes() {
        removeRoutes();
        bindRoutes();
    }
    private void removeRoutes() {
        for(String route: Routes.getAllRoutes()) {
            this.application.unmount(route);
        }
    }
}
