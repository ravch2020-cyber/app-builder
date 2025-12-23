const axios = require('axios');
const fs = require('fs');
const path = require('path');

class AEMPackageManager {
  constructor(aemEndpoint, username, password) {
    this.aemEndpoint = aemEndpoint;
    this.auth = {
      username: username,
      password: password
    };
  }

  /**
   * Fetch available content packages from AEM
   * @returns {Promise<Array>} List of available packages
   */
  async fetchPackages() {
    try {
      const url = `${this.aemEndpoint}/crx/packmgr/list.jsp`;
      const response = await axios.get(url, {
        auth: this.auth,
        headers: {
          'Accept': 'application/json'
        }
      });

      // Parse the response to extract package information
      const packages = this.parsePackageList(response.data);
      return packages;
    } catch (error) {
      throw new Error(`Failed to fetch packages: ${error.message}`);
    }
  }

  /**
   * Parse package list from AEM response
   * @param {Object} data - Response data from AEM
   * @returns {Array} Parsed package list
   */
  parsePackageList(data) {
    const packages = [];
    
    if (data && data.results) {
      data.results.forEach(pkg => {
        packages.push({
          name: pkg.name || 'Unknown',
          group: pkg.group || 'default',
          version: pkg.version || '1.0',
          path: pkg.path || '',
          downloadName: pkg.downloadName || pkg.name,
          size: pkg.size || 0,
          lastModified: pkg.lastModified || null
        });
      });
    }
    
    return packages;
  }

  /**
   * Download a package from AEM to local filesystem
   * @param {string} packagePath - Path to the package in AEM
   * @param {string} downloadDir - Local directory to save the package
   * @returns {Promise<string>} Path to the downloaded file
   */
  async downloadPackage(packagePath, downloadDir = './downloads') {
    try {
      // Ensure download directory exists
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      // Construct download URL
      const url = `${this.aemEndpoint}/crx/packmgr/download.jsp?path=${encodeURIComponent(packagePath)}`;
      
      // Extract filename from path
      const filename = path.basename(packagePath);
      const filePath = path.join(downloadDir, filename.endsWith('.zip') ? filename : `${filename}.zip`);

      // Stream download to file
      const response = await axios({
        method: 'GET',
        url: url,
        auth: this.auth,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to download package: ${error.message}`);
    }
  }

  /**
   * Download package and return as stream for HTTP response
   * @param {string} packagePath - Path to the package in AEM
   * @returns {Promise<Object>} Stream and filename
   */
  async downloadPackageStream(packagePath) {
    try {
      const url = `${this.aemEndpoint}/crx/packmgr/download.jsp?path=${encodeURIComponent(packagePath)}`;
      
      const response = await axios({
        method: 'GET',
        url: url,
        auth: this.auth,
        responseType: 'stream'
      });

      const filename = path.basename(packagePath);
      
      return {
        stream: response.data,
        filename: filename.endsWith('.zip') ? filename : `${filename}.zip`,
        contentType: 'application/zip'
      };
    } catch (error) {
      throw new Error(`Failed to download package: ${error.message}`);
    }
  }
}

module.exports = AEMPackageManager;
