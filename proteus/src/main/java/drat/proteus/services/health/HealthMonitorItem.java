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

package drat.proteus.services.health;

import drat.proteus.services.general.Item;

import java.net.URI;
import java.net.URISyntaxException;

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
