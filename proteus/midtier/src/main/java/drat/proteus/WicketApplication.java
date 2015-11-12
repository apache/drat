package drat.proteus;

import drat.proteus.rest.DratRestResource;
import drat.proteus.rest.ServicesRestResource;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.resource.IResource;
import org.apache.wicket.request.resource.ResourceReference;

/**
 * Application object for your web application.
 * If you want to run this application without deploying, run the Start class.
 *
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
        mountResource("/proteus/drat", new ResourceReference("restReference") {
            DratRestResource resource = new DratRestResource();
            @Override
            public IResource getResource() {
                return resource;
            }
        });
        mountResource("/proteus/service", new ResourceReference("restReference") {
            ServicesRestResource resource = new ServicesRestResource();
            @Override
            public IResource getResource() {
                return resource;
            }
        });
	}
}
