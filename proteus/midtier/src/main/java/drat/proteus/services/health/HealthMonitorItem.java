package drat.proteus.services.health;

import drat.proteus.services.general.Item;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by stevenfrancus on 10/29/15.
 */
public class HealthMonitorItem extends Item {
    private boolean isRunning;
    private String name;
    private URI url;
    public HealthMonitorItem(String name) {
        this.name = name;
    }

    public HealthMonitorItem(String name, String url) throws URISyntaxException {
        this(name);
        this.url = new URI(url);
    }

    public HealthMonitorItem(String name, String url, boolean isRunning) throws URISyntaxException {
        this(name, url);
        this.isRunning = isRunning;
    }

    public boolean isRunning() {
        return isRunning;
    }

    public void setRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public URI getUrl() {
        return url;
    }

    public void setUrl(String url) throws URISyntaxException {
        this.url = new URI(url);
    }
}
