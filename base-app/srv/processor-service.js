const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  init() {

    const { Incidents } = this.entities

    this.before ('UPDATE', Incidents, async req => {
      if (!req.subject.ref[0].where) return
      let closed = await SELECT.one.from (req.subject) .where `status.code = 'C'`.and (req.query.UPDATE.where)
      if (closed) req.reject `Can't modify a closed incident!`
    })

    this.before (['CREATE','UPDATE'], Incidents, req => {
      let urgent = req.data.title?.match(/urgent/i)
      if (urgent) req.data.urgency_code = 'H'
    })

    return super.init()
  }
}

module.exports = { ProcessorService }
