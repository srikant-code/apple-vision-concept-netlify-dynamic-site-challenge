# Next.js on Netlify Platform Starter

[Live Demo](https://nextjs-platform-starter.netlify.app/)

A modern starter based on Next.js 14 (App Router), Tailwind, daisyUI, and [Netlify Core Primitives](https://docs.netlify.com/core/overview/#develop) (Edge Functions, Image CDN, Blob Store).

In this site, Netlify Core Primitives are used both implictly for running Next.js features (e.g. Route Handlers, image optimization via `next/image`, and more) and also explicitly by the user code. 

Implicit usage means you're using any Next.js functionality and everything "just works" when deployed - all the plumbing is done for you. Explicit usage is framework-agnostic and typically provides more features than what Next.js exposes.

## Deploying to Netlify

This site requires [Netlify Next Runtime v5](https://docs.netlify.com/frameworks/next-js/overview/) for full functionality. That version is now being gradually rolled out to all Netlify accounts. 

After deploying via the button below, please visit the **Site Overview** page for your new site to check whether it is already using the v5 runtime. If not, you'll be prompted to opt-in to to v5.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-platform-starter)

## Developing Locally

1. Clone this repository, then run `npm install` in its root directory.

2. For the starter to have full functionality locally (e.g. edge functions, blob store), please ensure you have an up-to-date version of Netlify CLI. Run:

```
npm install netlify-cli@latest -g
```

3. Link your local repository to the deployed Netlify site. This will ensure you're using the same runtime version for both local development and your deployed site.

```
netlify link
```

4. Then, run the Next.js development server via Netlify CLI:

```
netlify dev
```

If your browser doesn't navigate to the site automatically, visit [localhost:8888](http://localhost:8888).

--- 

*This is a submission for the [Netlify Dynamic Site Challenge](https://dev.to/challenges/netlify): Visual Feast.*


## Submission Demo
<!-- Share a link to your Netlify app and include some screenshots here. -->
This project showcases three key features of Netlify, each feature is specifically demonstrated through a different application that I made:
Link to Demo 
https://apple-vision-concept-dynamic-site.netlify.app/
 > Home page screenshot
![Home page screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wrkhyfddo0sbyvtflh3j.png)

#### Link to all my submissions
1. Memories App Concept - This article
2. Albums App Concept - https://dev.to/srikant_code/albums-apple-vision-concept-app-using-netlifys-blobs-next-js-9ep
3. Discover App Concept - https://dev.to/srikant_code/discover-apple-vision-concept-app-using-netlifys-cache-revalidation-next-js-ssr-1ifj

## What I Built | Concept / Ideation
<!-- Share an overview about your project. -->
Hey👋, I'm Srikant Sahoo. I'm excited to present this project for the `Netlify Dynamic Site Challenge`. This project is a cutting-edge concept user interface designed for virtual reality devices, taking inspiration from futuristic concepts like `Apple Vision👓` to showcase how Netlify's capabilities can be leveraged to create such applications in future for VR use cases. 

> Side note for your reference - More info on Apple Vision Pro https://www.apple.com/newsroom/2024/02/apple-announces-more-than-600-new-apps-built-for-apple-vision-pro/

---

## Why I built this Apple Vision Concept?
The major question that I had was...

> How can I use all the 3 themes in one project🤔? 

Even though I had this question, I still started with creating a `Image Gallery` using Image CDN. But then later on during development I figured out that I can instead convert it into a small virtual app called `Memories App` instead of `Gallery App or Photos App`, and similarly create more virtual apps for the other 2 prompts. 

> `All Photos` view
![All photos view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sd8gl5bkgno7j9fwl0uk.png)


So, the first thing that came into my mind was to create a mock concept environment for `Apple Vision Pro👓` where users can see and interact with the 3 apps while being sitting at the couch. Thats how I proceeded and build the UX and then eventually developed it.

> Three apps navigation
![Three app navigation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ylcgtettzxn3rxr5mt6o.png)



## Platform Primitives
<!-- Tell us how you leveraged the Netlify Image CDN. -->
Below are the details on how I leveraged the `Netlify Image CDN`, `Netlify Blobs` storage and `Netlify's Cache Revalidation` in three different virtual apps.
 
### 1. Memories App
This app leverages `Netlify's Image CDN` capability to display photos in responsive way. You can toggle the below tabs to filter images by date category and see images in different sizes. 
> `Days` view
![Days view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oobq9amxe7byktpr43f0.png)

It queries the Image CDN to render the most optimized version for quick loading of the images in an animated way. You can click any photo to see in good resolution. 

> Fetches the most optimized image using queries like `&w=64&q=75`
![Fetches the most optimized image using queries like `&w=64&q=75`](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/twwxbztgzobuzr7nfce0.png)

> UI on clicking any image
![UI on clicking any image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7cnitf7co3fgttljbnt8.png)

The Netlify's blob storage is used in the `Add photos to Albums` button. It stores the opened photo to one of your Album (More on this below)


![add photos to albums](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vazoszbmnp3670b9c7o0.png)


### 2. Albums App
This app utilizes `Netlify's Blobs` storage to store your albums and its contents. Once you land on the page, you are automatically assigned a unique username (kind of a mock authentication). 

![screen capture of albums app](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4lh7x3xmggke9u2gpwr5.png)


I have written a clever and complex logic to handle the albums data in blobs. You can also see other users' albums from the `Other's Albums` tab. 


![albums 1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x5ymnky896hbnltl5exv.png)

![albums 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y86td6tfdnk31yw6xfvb.png)

![albums 3](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2cfdj447zhd2bgtr1r8i.png)


#### Challenges Faced while developing this `Albums` App
I faced a lot of challenges while implementing this. 
Initially the blobs were only working in the `netlify dev` env and was not working when I was deploying it (which was making it harder to debug). It bugged me for days, I needed to go through all the related documentation to understand and fix it.

But spending 1-2 days on consistent bug fixing and observing the patterns, I finally figured out the way to work with blobs. 

I also faced challenges on the below
- Implementation of expiration logic of blobs to free up space.
- How to tackle multiple users updating the same blob
- How to refresh the UI between the Memories and Albums App when anything is updated.  
- How to setup and use the blobs without using edge functions and instead use the Netlify APIs directly using the `use server`.
- And as mentioned above on deployment part


### 3. Discover App
This app uses `Netlify's Cache Revalidation` feature to fetch the latest articles from the web (Wikipedia Random API) using Server-Side Rendering technique of Next JS). It highlights how Netlify's Cache Revalidation can ensure users always have access to the most recent information on demand.

> Below code -> uses the Next cache headers and tagName to revalidate the cache
![code image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2wn706pkuuy0ion6dxdv.png)


![screenshot of discover app](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gn73q2mgmbooyjnlw2xa.png)

I was new to `Next JS SSR`, so I was initially facing difficulties with the SSR logic, but figured out how to tackle it to render the UI having the wiki article.

---
### Disclaimer 
> Please note that this project is not associated with any organization and is purely a result of my passion and 💘 for technology and innovation, which I have done both the UX design and developed it in the last 5-6 days.

> All the assets, graphics, and icons used in this project have been duly referenced in the project itself for transparency, and you can find the sources in the `References` section of the project. This project is a testament to my commitment to ethical practices in software development.
![references inside another app](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/er9m9myhayztjqce2y1g.png)



This project is a hobby endeavor that I'm proud of, and I hope it helps you to understand the potential of Netlify's capabilities.

It took me more than 5 days to build this. Would really appreciate if you liked it and can like this post (🦄,💘). It will motivate me to create more such kind of creative applications and use Netlify in my future projects😄.

Thank you

---

#### Link to all my submissions
1. Memories App Concept - This article
2. Albums App Concept - https://dev.to/srikant_code/albums-apple-vision-concept-app-using-netlifys-blobs-next-js-9ep
3. Discover App Concept - https://dev.to/srikant_code/discover-apple-vision-concept-app-using-netlifys-cache-revalidation-next-js-ssr-1ifj

<!-- Did you implement additional platform primitives like Netlify Blobs or Cache Control? Tell us about that too! You may qualify for more than one prompt. -->

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->


<!-- Don't forget to add a cover image (if you want). -->


<!-- Thanks for participating! -->
