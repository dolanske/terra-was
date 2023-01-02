<script setup lang="ts">
import type { TripDB } from '~~/utils/trip.types'

const posts = reactive<{ value: TripDB[] }>({ value: [] })

onBeforeMount(() => {
  const { data } = useFetch('/api/trip', { method: 'GET' })

  if (!data.value)
    return

  posts.value = data.value as TripDB[]
})
</script>

<template>
  <div class="container">
    <code>
      <pre>{{ posts.value }}</pre>
    </code>
    <!-- <h1 id="example-markdown-post">
      <a class="anchor" href="#example-markdown-post" aria-hidden="true"><span class="octicon octicon-link" /></a>Example Markdown Post
    </h1>

    <h2 id="basic-setup">
      <a class="anchor" href="#basic-setup" aria-hidden="true"><span class="octicon octicon-link" /></a>Basic setup
    </h2>

    <p>Jekyll requires blog post files to be named according to the following format:</p>

    <p><code class="language-plaintext highlighter-rouge">YEAR-MONTH-DAY-filename.md</code></p>

    <p>Where <code class="language-plaintext highlighter-rouge">YEAR</code> is a four-digit number, <code class="language-plaintext highlighter-rouge">MONTH</code> and <code class="language-plaintext highlighter-rouge">DAY</code> are both two-digit numbers, and <code class="language-plaintext highlighter-rouge">filename</code> is whatever file name you choose, to remind yourself what this post is about. <code class="language-plaintext highlighter-rouge">.md</code> is the file extension for markdown files.</p>

    <p>The first line of the file should start with a single hash character, then a space, then your title. This is how you create a “<em>level 1 heading</em>” in markdown. Then you can create level 2, 3, etc headings as you wish but repeating the hash character, such as you see in the line <code class="language-plaintext highlighter-rouge">## File names</code> above.</p>

    <h2 id="basic-formatting">
      <a class="anchor" href="#basic-formatting" aria-hidden="true"><span class="octicon octicon-link" /></a>Basic formatting
    </h2>

    <p>You can use <em>italics</em>, <strong>bold</strong>, <code class="language-plaintext highlighter-rouge">code font text</code>, and create <a href="https://www.markdownguide.org/cheat-sheet/">links</a>. Here’s a footnote <sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote" rel="footnote">1</a></sup>. Here’s a horizontal rule:</p>

    <hr>

    <h2 id="lists">
      <a class="anchor" href="#lists" aria-hidden="true"><span class="octicon octicon-link" /></a>Lists
    </h2>

    <p>Here’s a list:</p>

    <ul>
      <li>item 1</li>
      <li>item 2</li>
    </ul>

    <p>And a numbered list:</p>

    <ol>
      <li>item 1</li>
      <li>item 2</li>
    </ol>

    <h2 id="boxes-and-stuff">
      <a class="anchor" href="#boxes-and-stuff" aria-hidden="true"><span class="octicon octicon-link" /></a>Boxes and stuff
    </h2>

    <blockquote>
      <p>This is a quotation</p>
    </blockquote> -->
  </div>
</template>

<style lang="scss">
.container {
  display: block;
  width: 756px;
  padding: 80px 0;
  margin: 0 auto;
}
</style>
