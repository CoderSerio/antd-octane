# Upload (unreleased source)

Development implementation; not shipped in alpha.7. Supports native file selection,
accept/multiple, controlled fileList (or defaultFileList), beforeUpload including
async transforms, false (list only), and Upload.LIST_IGNORE (no list or request).
The browser's accept hint is not server-side file validation. Supply action for
POST multipart XHR or customRequest with progress/success/error callbacks and an
abort handle. Controlled owners must accept onChange's fileList; rejected files
are not uploaded. Removing a file can be vetoed asynchronously; approved removal
and unmount abort active requests and suppress later callbacks.

Data and headers are static maps; name is the multipart file-field name. Request
errors remain visible and reported through onChange. Server authorization and
validation belong to the application. No requests are made merely by mounting.

Dragger, directory/paste, image thumbnails/preview, listType, maxCount, retry UI,
custom item rendering, async action/data, and full upstream visual/component-token
parity are not implemented. Custom children (including Button) use a keyboard-accessible trigger wrapper;
disabled children are inert. The default trigger remains a native button.
