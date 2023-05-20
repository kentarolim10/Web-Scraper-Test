import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const scrapeOpenStax = api.webScraper.scrapeOpenStax.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });

  const [input, setInput] = useState("");

  const scrapeFunction = async () => {
    const res = await scrapeOpenStax.mutate({ subject: input });
  };

  return (
    <>
      <Head>
        <title>Web Scraper Test</title>
      </Head>
      <main>
        <div>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="border-2 border-black"
          />
          <button onClick={scrapeFunction} className="bg-slate-600 text-white">
            Scrape
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
