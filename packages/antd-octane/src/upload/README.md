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

Directory/paste, image thumbnails/preview, listType, retry UI,
custom item rendering, async action/data, and full upstream visual/component-token
parity are not implemented. Custom children (including Button) use a keyboard-accessible trigger wrapper;
disabled children are inert. The default trigger remains a native button.


## Drag and drop and file limits (unreleased)

`Upload.Dragger` shares the same file pipeline and list API. Its focusable drop
area opens the file chooser on Enter/Space; native interactive children retain
their own keyboard behavior. Dropping files prevents browser navigation, including
when disabled. Disabled drop areas neither upload nor call `onDrop` and remove
children from keyboard navigation. `height` sizes the area; `onDrop` receives the
native event for accepted drop interactions (before filtering).

`accept` filters filename extensions and MIME patterns (`.pdf`, `image/*`,
`application/pdf`); it remains a client-side convenience, not server validation.
Without `multiple`, only the first matching file is handled. Directory traversal
and pasted files are not implemented.

`maxCount` must be a positive integer. `1` replaces the previous listed file;
larger limits keep existing files and append incoming files until full. Excess
files are intercepted by `beforeUpload` but do not enter the list or start a
request. `LIST_IGNORE` never replaces an existing file. A file returning `false`
still takes a list slot. Replaced in-flight files are aborted only once the owner
accepts their removal; rejected controlled replacements preserve the old request.
Changing `maxCount` alone does not truncate a supplied controlled/default list.

A newer selection supersedes an older pending `beforeUpload` when `maxCount=1`.
Turning disabled on or unmounting also prevents pending interception results from
starting requests. When an owner removes a file while `onRemove` is pending, that
old decision cannot remove a later re-added file with the same uid. Keep uids
unique and stable for the lifetime of each file.

```tsx
<Upload.Dragger action="/api/upload" accept=".pdf,image/*" multiple maxCount={3}>
  Drop up to three documents here, or press Enter to choose files.
</Upload.Dragger>
```

The upload endpoint must be supplied by the application. These APIs are not yet
available from the site's published alpha.7 package. `itemRender` is still omitted;
preview/download actions and a custom list rendering contract are not implemented.
