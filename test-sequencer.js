const Sequencer = require('@jest/test-sequencer').default


class TestSequencer extends Sequencer{
  sort(tests) {
    const fileOrder = [
      'src/auth/auth.resolver.spec.ts',
      'src/auth/auth.service.spec.ts',
      'src/users/users.resolver.spec.ts',
      'src/users/users.service.spec.ts'
    ];

    const orderMap = new Map(fileOrder.map((path, index) => [path, index]))

    return tests.sort((testA, testB) => {
      const indexA = orderMap.get(testA.path) || Infinity
      const indexB = orderMap.get(testB.path) || Infinity
      return indexA - indexB
    })
  }

  cacheResults() {
    // Dummy caching logic, as Jest expects this method to exist
    console.log('Caching test results')
  }
}

module.exports = TestSequencer