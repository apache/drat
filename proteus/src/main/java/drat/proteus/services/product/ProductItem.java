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

package drat.proteus.services.product;

import drat.proteus.services.general.Item;

public class ProductItem extends Item {
  private String title;
  private String description;
  private String link;
  private String casSource;
  private String source;
  private String pubDate;

  public ProductItem(String title, String description, String pubDate,
      String link, String casSource, String source) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.pubDate = pubDate;
    this.casSource = casSource;
    this.source = source;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLink() {
    return link;
  }

  public void setLink(String link) {
    this.link = link;
  }

  public String getCasSource() {
    return casSource;
  }

  public void setCasSource(String casSource) {
    this.casSource = casSource;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }

  public void setPubDate(String pubDate) {
    this.pubDate = pubDate;
  }

  public String getPubDate() {
    return this.pubDate;
  }

  public String toJson() {
    return "{\n" + "   \"title\": \"" + this.title + "\",\n"
        + "   \"description\": \"" + this.description + "\",\n"
        + "   \"pubDate\": \"" + this.pubDate + "\",\n"
        + "   \"casSource\": \"" + this.casSource + "\",\n"
        + "   \"source\": \"" + this.source + "\"\n" + "} ";
  }
}
