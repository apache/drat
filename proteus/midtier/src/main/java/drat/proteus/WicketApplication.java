package drat.proteus;

import drat.proteus.method.DratMethod;
import drat.proteus.routes.RoutingHandler;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.resource.IResource;
import org.apache.wicket.request.resource.ResourceReference;

/**
 * Application object for your web application.
 * If you want to run this application without deploying, run the Start class.
 * 
 * @see drat.proteus.Start#main(String[])
 */
public class WicketApplication extends WebApplication
{

	@Override
	public Class<? extends WebPage> getHomePage()
	{
		return HomePage.class;
	}

	/**
	 * @see org.apache.wicket.Application#init()
	 */
	@Override
	public void init()
	{
		super.init();
        new RoutingHandler(this).bind(); //handles all Wicket routing general unpleasantness
        mountResource("/proteus", new ResourceReference("restReference") {
            DratMethod resource = new DratMethod();
            @Override
            public IResource getResource() {
                return resource;
            }
        });
	}
}
