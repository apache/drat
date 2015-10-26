package drat.proteus;

import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessOodtWrapper;
import drat.proteus.routes.RoutingHandler;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;

import java.io.IOException;

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
	}
}
