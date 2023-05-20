import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { spawnSync } from "child_process";
// import { chromium } from "playwright";
// import { chromium } from "playwright-core";
// import bundledChromium from "chrome-aws-lambda";
import { chromium } from "playwright-chromium";

export const webScraperRouter = createTRPCRouter({
  scrapeOpenStax: publicProcedure
    .input(z.object({ subject: z.string() }))
    .mutation(async ({ input }) => {
      spawnSync("npx", ["playwright", "install", "chromium"]);
      const browser = await chromium.launch({ headless: true });
      //   const browser = await chromium.launch({ headless: true });
      //   const browser = await Promise.resolve(
      //     bundledChromium.executablePath
      //   ).then((executablePath) => {
      //     if (!executablePath) {
      //       // local execution
      //       return chromium.launch({});
      //     }
      //     return chromium.launch({ executablePath });
      //   });
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
