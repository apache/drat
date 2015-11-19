package drat.proteus;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import drat.proteus.rest.DratRestResource;
import drat.proteus.rest.ServicesRestResource;

import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.resource.IResource;
import org.apache.wicket.request.resource.PackageResourceReference;
import org.apache.wicket.request.resource.ResourceReference;
import org.apache.wicket.util.file.File;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;

/**
 * Application object for your web application.
 * If you want to run this application without deploying, run the Start class.
 *
 */
public class WicketApplication extends WebApplication
{
  
  private Logger LOG = Logger.getLogger(WicketApplication.class.getName());

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
        mountResource("/drat", new ResourceReference("restReference") {
            DratRestResource resource = new DratRestResource();
            @Override
            public IResource getResource() {
                return resource;
            }
        });
        mountResource("/service", new ResourceReference("restReference") {
            ServicesRestResource resource = new ServicesRestResource();
            @Override
            public IResource getResource() {
                return resource;
            }
        });
        mountPage("/workflow", DratWorkflow.class);
        
        doImageMounts(getImageFiles(WicketApplication.class.getPackage().getName()), (Class<?>) HomePage.class);
	}
	
  private void doImageMounts(Set<String> resources, Class<?> clazz) {
    if (resources != null) {
      for (String resource : resources) {
        String resName = new File(resource).getName();
        String resPath = "/images/" + resName;
        LOG.log(Level.INFO, "Mounting: [" + resPath + "] origName: [" + resName
            + "]: resource: [" + resource + "]");
        PackageResourceReference imgRef = new PackageResourceReference(getClass(), resName);
        mountResource(resPath, imgRef);        
      }
    }
  }

  private Set<String> getImageFiles(String packageName) {
    Pattern pattern = Pattern.compile(".*\\.(png|gif|jpg|jpeg|jp2)");
    Set<String> resources = new Reflections(packageName, new ResourcesScanner())
        .getResources(pattern);
    Set<String> filteredResources = new HashSet<String>();
    Map<String, Boolean> resMap = new HashMap<String, Boolean>();
    for (String res : resources) {
      String resName = new File(res).getName();
      if (!resMap.containsKey(resName)) {
        resMap.put(resName, true);
        filteredResources.add(resName);
      }
    }

    return filteredResources;
  }
}
