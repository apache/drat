package backend;

/*import org.apache.oodt.cas.filemgr.structs.Product;
import org.apache.oodt.cas.filemgr.structs.ProductPage;
import org.apache.oodt.cas.filemgr.structs.ProductType;
import org.apache.oodt.cas.filemgr.structs.Reference;
import org.apache.oodt.cas.filemgr.system.XmlRpcFileManagerClient;
import org.apache.oodt.cas.workflow.structs.WorkflowInstance;
import org.apache.oodt.cas.workflow.structs.WorkflowInstancePage;
import org.apache.oodt.cas.workflow.system.XmlRpcWorkflowManagerClient;*/

import java.io.IOException;
import java.net.URL;
import java.util.List;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class Start {
    static int fileCount = 0;
    private static AbstractDratWrapper dratWrapper = ProcessDratWrapper.getInstance();
    private static AbstractOodtWrapper oodtWrapper = ProcessOodtWrapper.getInstance();
    public static void main(String[] args) {
        try {
            /*if(false) {
                XmlRpcWorkflowManagerClient client = new XmlRpcWorkflowManagerClient(new URL("http://localhost:9001"));
                WorkflowInstancePage page = client.getFirstPage();
                System.out.println(page.getPageNum());
                for (Object workflowInstance : page.getPageWorkflows()) {
                    WorkflowInstance instance = (WorkflowInstance) workflowInstance;
                    System.out.println(instance.getCurrentTask().getTaskName());
                    System.out.println(instance.getState());
                    System.out.println(instance.getCurrentTaskId());
                    System.out.println();
                }
            }

            XmlRpcFileManagerClient fileManagerClient = new XmlRpcFileManagerClient(new URL("http://localhost:9000"));
            System.out.println("******");
            List<ProductType> types = fileManagerClient.getProductTypes();
            for(ProductType type: types) {
                ProductPage page = fileManagerClient.getFirstPage(type);
                if(page == null) {
                    continue;
                }
                List<Product> products = page.getPageProducts();
                for(Product product: products) {
                    for(Reference ref: product.getProductReferences()) {
                        System.out.println(ref.toString());
                    }
                }
                System.out.println(type);
            }*/
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public static void restartOodt() throws IOException {
        oodtWrapper.stop();
        oodtWrapper.reset();
        oodtWrapper.run();
    }
}
