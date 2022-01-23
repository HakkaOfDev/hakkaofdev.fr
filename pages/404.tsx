import Layout from '@/components/layout'
import { Box, Button, Divider, Heading, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

const NotFound = () => {
  return (
    <Layout
      title='Not found'
      description="The page you're looking for was not found."
    >
      <VStack py={20} spacing={4}>
        <Box alignSelf='start'>
          <Heading as='h1'>Not found</Heading>
          <Text>The page you&apos;re looking for was not found.</Text>
        </Box>
        <Divider my={10} />
        <NextLink href='/' passHref>
          <Button colorScheme='hakka' alignSelf='center'>
            Return to home
          </Button>
        </NextLink>
      </VStack>
    </Layout>
  )
}

export default NotFound
