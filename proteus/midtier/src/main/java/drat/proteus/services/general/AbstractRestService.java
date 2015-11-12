package drat.proteus.services.general;

/**
 * Created by stevenfrancus on 10/30/15.
 */
public abstract class AbstractRestService extends RequestEmitter {
    public AbstractRestService(String service) {
        super(service);
    }
}
