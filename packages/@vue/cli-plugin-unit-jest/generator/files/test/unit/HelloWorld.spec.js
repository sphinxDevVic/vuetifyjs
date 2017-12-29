import { shallow } from 'vue-test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('Hello.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallow(HelloWorld, {
      context: { props: { msg } }
    })
    expect(wrapper.text()).toBe(msg)
  })
})
