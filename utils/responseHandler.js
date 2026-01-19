/**
 * Standardize API responses
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Message to send
 * @param {Object} data - Data to send
 */
exports.sendResponse = (res, status, message, data = null) => {
    res.status(status).json({
        success: status >= 200 && status < 300,
        message,
        data
    });
};
