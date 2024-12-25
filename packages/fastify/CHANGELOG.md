# Changelog

### **1.4.0**

**Changes**:

- Added support to `pushToken` as a parameter for `onRegister` callback;

---

### **1.3.0**

**Changes**:

- Added support to Fastify v5. This release makes it compatible with both v4 and v5;

---

### **1.2.0**

**Changes**:

- Added support to `undefined` return type from `onUpdateRequest` callback. When this will happen, an `HTTP 304 Not Modified` will be sent instead. When a pass is returned, instead, the header `last-modified` will be supplied to the response, with the current UTC time;
- Added support to a new parameter `modifiedSinceTimestamp` in `onUpdateRequest` callback, containing the timestamp (number) of the provided request header `if-modified-since`. If the header is not available, it will be `undefined`;

---

### **1.1.0**

**Changes**:

- Added hooks-performed checks on return types for `update` and `list` plugins callbacks;
- Replaced `console.warn` with fastify logs;
- Improved tests and typechecking for plugins;

**Bug fix**:

- Fixed `list` plugin, which was listening for `POST` instead of `GET`;
- Renamed `list` plugin's queryString parameters (and, therefore, the according parameter in `onListRetrieve` 'filters') to `passesUpdatedSince`, as per Apple documentation;

---

### **1.0.2**

**Changes**:

- Renamed `onIncomingLog` to `onIncomingLogs`;
