/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package drat.proteus.services.licenses;

import drat.proteus.services.general.Item;
import drat.proteus.services.product.BaseProductService;
import drat.proteus.services.product.ProductItem;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RatInstanceService extends BaseProductService {
  private static final String CHANNEL = "RatLog";
  private static final String TYPE_ID = "urn:drat:RatLog";
  private RatAggregator aggregator;
  private static Client client = ClientBuilder.newBuilder().newClient();

  public RatInstanceService() {
    aggregator = new RatAggregator();
  }

  public void getRatLogs() {
    aggregator.clear();
    List<Item> ratLogProducts = super.getRecentProductsByChannelAndTypeId(
        CHANNEL, TYPE_ID);
    if (ratLogProducts == null) {
      return;
    }
    for (Item item : ratLogProducts) {
      RatLog log = getLicenseTypesFromRatLog(((ProductItem) item).getLink());
      aggregator.add(log);
    }
  }

  public List<Item> getLicenseTypeBreakdown() {
    Map<String, Integer> aggregate = aggregator.getAggregatedLicenseTotal();
    List<Item> breakdownItems = new ArrayList<>();
    int totalLicensesInRepo = 0;
    for (Integer count : aggregate.values()) {
      totalLicensesInRepo += count;
    }
    for (String license : aggregate.keySet()) {
      Integer numberOfLicenses = aggregate.get(license);
      LicenseTypeBreakdownItem breakdownItem = new LicenseTypeBreakdownItem(
          license, numberOfLicenses, totalLicensesInRepo);
      breakdownItems.add(breakdownItem);
    }
    return breakdownItems;
  }

  public List<Item> getUnapprovedLicenses() {
    return aggregator.getRatUnapprovedLicenses();
  }

  private RatLog getLicenseTypesFromRatLog(String ratLogLink) {
    WebTarget target = client.target(ratLogLink);
    Invocation.Builder builder = target.request();
    Response res = builder.get();
    return new RatLog(res.readEntity(String.class));
  }
}
