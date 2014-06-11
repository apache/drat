/*
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

package org.apache.drat.pge;

import java.util.logging.Logger;

import org.apache.oodt.cas.crawl.ProductCrawler;
import org.apache.oodt.cas.crawl.StdProductCrawler;
import org.apache.oodt.cas.pge.StdPGETaskInstance;
import org.apache.oodt.cas.pge.metadata.PgeTaskMetadataKeys;

/**
 * Remap statuses in CAS-PGE
 */
public class DRATPGETaskInstance extends StdPGETaskInstance {

	Logger logger = Logger.getLogger(DRATPGETaskInstance.class.getName());

	/* PGE task statuses */
	public static final String STAGING_INPUT = "STAGING INPUT";

	public static final String CONF_FILE_BUILD = "BUILDING CONFIG FILE";

	public static final String RUNNING_PGE = "PGE EXEC";

	public static final String CRAWLING = "CRAWLING";

	/**
     * 
     */
	public DRATPGETaskInstance() {
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.apache.oodt.cas.pge.PGETaskInstance#updateStatus(java.lang.String)
	 */
	@Override
	protected void updateStatus(String status) {
		String skaStatus = this.convertStatus(status);
		super.updateStatus(skaStatus);
	}

	private String convertStatus(String casPgeStatus) {
		if (casPgeStatus.equals(PgeTaskMetadataKeys.CONF_FILE_BUILD)) {
			return CONF_FILE_BUILD;
		} else if (casPgeStatus.equals(PgeTaskMetadataKeys.STAGING_INPUT)) {
			return STAGING_INPUT;
		} else if (casPgeStatus.equals(PgeTaskMetadataKeys.CRAWLING)) {
			return CRAWLING;
		} else if (casPgeStatus.equals(PgeTaskMetadataKeys.RUNNING_PGE)) {
			return RUNNING_PGE;
		} else
			return casPgeStatus;
	}
}
