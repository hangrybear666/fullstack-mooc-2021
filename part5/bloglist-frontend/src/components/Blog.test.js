import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'Herb Dean',
    title: 'Second class tests',
    url: 'http://localhost:3000/',
    likes: 7,
    user: {
      username: 'Superuser',
      user: 'root'
    }
  }

  render(<Blog blog={blog} />)

  // screen.debug()

  const element = screen.getByText('Herb Dean')

  // screen.debug(element)
  expect(element).toBeDefined()
})