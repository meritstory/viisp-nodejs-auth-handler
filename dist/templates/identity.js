"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityTemplate = ({ uniqueId, pid, ticket }) => {
    return `
<authentication:authenticationDataRequest 
  xmlns:authentication="http://www.epaslaugos.lt/services/authentication" 
  xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" 
  xmlns:ns3="http://www.w3.org/2001/10/xml-exc-c14n#" 
  id="${uniqueId}"
>
  <authentication:pid>${pid}</authentication:pid>
  <authentication:ticket>${ticket}</authentication:ticket>
  <authentication:includeSourceData>true</authentication:includeSourceData>
</authentication:authenticationDataRequest>  
`;
};
//# sourceMappingURL=identity.js.map