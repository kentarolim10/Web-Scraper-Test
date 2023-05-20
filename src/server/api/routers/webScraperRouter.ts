import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { chromium } from "playwright";
// import playwright from "playwright-aws-lambda";

export const webScraperRouter = createTRPCRouter({
  scrapeOpenStax: publicProcedure
    .input(z.object({ subject: z.string() }))
    .mutation(async ({ input }) => {
      const browser = await chromium.launch({ headless: true });
      //   const browser = await playwright.launchChromium();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(`https://www.openstax.org/books/${input.subject}`);

      const pageTitle = await page.title();
      console.log(pageTitle);

      const indexKeyWords = await page.$$eval(
        "#os-term",
        (elements: HTMLSpanElement[]) =>
          elements.map((element) => element.textContent)
      );

      console.log(indexKeyWords);

      await browser.close();
      return {
        // keyWords: indexKeyWords,
        pageTitle: pageTitle,
      };
    }),
});
