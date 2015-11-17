package drat.proteus.services.product;

import drat.proteus.services.general.Item;

import java.util.List;

public class RecentProductService extends BaseProductService {
    public List<Item> getAllRecentProducts() {
        return super.getRecentProductsByChannel("ALL");
    }
}
