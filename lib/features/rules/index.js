module.exports = {
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  __init__: ['spartaRules'],
  spartaRules: [ 'type', require('./SpartaRules') ]
};
