import Layout from '../../components/main_layout'
import i18n from '../../lib/i18n'
import Head from 'next/head'
import { useRouter } from 'next/router'
import TopComponent from '../../components/main_top-component'
import MiddleComponent from '../../components/main_middle-component'
import Carousel from '../../components/media_carousel-main'
import Gallery from '../../components/media_gallery'
import { request } from '../../lib/datocms'
import { useQuerySubscription } from 'react-datocms'
import Articles from '../../components/media_articles'

export async function getStaticProps ({ preview, locale }) {
  const formattedLocale = locale.split('-')[0]

  const graphqlRequest = {
    query: `{
      allArticles(locale: ${formattedLocale})  {
        id
        date
        textToLink
        title
        urlToArticles
        authorName
        articleDescribe
      }
    }`,
    preview,
  }
  return {
    props: {
      subscription: preview
        ? {
          ...graphqlRequest,
          initialData: await request(graphqlRequest),
          token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
          environment: process.env.NEXT_DATOCMS_ENVIRONMENT || null,
        }
        : {
          enabled: false,
          initialData: await request(graphqlRequest),
        },
    },
  }
}

export default function Media ({ subscription }) {
  const { locale } = useRouter().locale
  const { data: { allArticles } } = useQuerySubscription(subscription)

  return (
    <Layout> <Head>
      <title>{i18n.main.address[locale]}</title>
      <meta name='description'
            content='Generated by create next app'
      />
      <link rel='icon'
            href='/favicon.ico'
      />
    </Head>

      <TopComponent>
        <Carousel />
      </TopComponent>

      <MiddleComponent>
        <Gallery />
      </MiddleComponent>

      {allArticles.length > 0 && (
        <Articles allArticles={allArticles} />
      )}

    </Layout>
  )
}
