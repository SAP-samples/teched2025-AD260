const cds = require('@sap/cds');
const DEBUG = cds.debug('predef-ext-fields');

// Register plugin hooks
cds.on('compile.for.runtime', csn => { DEBUG?.('on','compile.for.runtime'); addExtensionFields(csn) })
cds.on('compile.to.edmx', csn => { DEBUG?.('on','compile.to.edmx'); addExtensionFields(csn) })
cds.on('compile.to.dbx', csn => { DEBUG?.('on','compile.to.dbx'); addExtensionFields(csn) })


addExtensionFields = csn => {
  const meta = (csn.meta ??= {})

  if (meta._enhanced_for_predefined_extension_fields) return

  for (const [name, def] of Object.entries(csn.definitions)) {
    if (def.kind === 'entity' && def['@extensible']) {
      console.log(`Extending ${name}`)
      def.elements['predef_field_1'] = { type: 'cds.String', length: 10 }
      def.elements['predef_field_2'] = { type: 'cds.String', length: 10 }
      def.elements['predef_field_3'] = { type: 'cds.String', length: 10 }
    }
  }

  meta._enhanced_for_predefined_extension_fields = true
}