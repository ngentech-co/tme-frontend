export default function HistoryOfTimeCapsules() {
  return (
    <>
      <p>
        The urge to send a message forward in time is older than writing itself. Long
        before we had paper, before we had language as we know it, humans buried objects
        in the ground with the vague hope that someone, someday, would dig them up.
      </p>

      <p>
        Time capsules are, in some sense, the original internet: a network of messages
        sent to an unknown recipient at an unknown time.
      </p>

      <h2>Babylon and before</h2>

      <p>
        The earliest known time capsule was buried under the <em>Western Wall</em> of
        the temple in Babylon around 537 BCE. It contained a scroll describing the
        temple's construction. Two and a half millennia later, archaeologists found it.
      </p>

      <h2>The Crypt of Civilization (1936)</h2>

      <p>
        Oglethorpe University in Georgia sealed a "Crypt of Civilization" in 1936,
        scheduled to open in 8113 CE. It contains a cross-section of 1930s life: a
        typewriter, a copy of <em>Lolita</em>, a bottle of Budweiser, seeds, and a
        dictionary microfilmed onto plates. It's the largest time capsule ever built.
      </p>

      <p>
        Whoever opens it will have a complete picture of one specific moment of human
        life. That's the magic of time capsules: not the message itself, but the
        <em>snapshot of being alive</em> that they preserve.
      </p>

      <h2>The Westinghouse capsules (1939, 1965)</h2>

      <p>
        The two most famous American time capsules were buried at the 1939 and 1964 New
        York World's Fairs. The 1939 capsule, scheduled to open in 6939 CE, contains
        essays by Albert Einstein and a copy of the screenplay for <em>The
        Citizen Kane</em>. The 1965 capsule, scheduled for 2065, contains a Beatles
        record, a piece of a moon rock, and a "peace pipe."
      </p>

      <h2>The internet era</h2>

      <p>
        The first internet-era time capsule was probably the <em>FutureMe</em> service,
        launched in 2007 by Matt Sly. It allowed anyone to write an email that would be
        delivered to themselves at a future date. It was beautiful and simple, and it
        captured the feeling of the early web — small, personal, a little naive.
      </p>

      <p>
        FutureMe is still running, almost twenty years later. It has delivered millions
        of messages. But it has a fundamental limitation: it can read every message you
        send. The company is trusted to keep your secret. The company is trusted to
        not be breached. The company is trusted to not be sold.
      </p>

      <h2>The cryptographic era</h2>

      <p>
        In 2019, the Drand project launched — a public randomness beacon run by a
        consortium of organizations, designed to produce verifiable, unpredictable
        signatures on a regular schedule. Around the same time, a handful of cryptographers
        started applying IBE (identity-based encryption) to the time-capsule problem.
      </p>

      <p>
        The math says: a message can be encrypted against a specific future round of
        Drand such that no one — not the service storing it, not a government, not a
        future cryptographer — can decrypt it until Drand publishes that round's
        signature.
      </p>

      <p>
        That math is what tomorrowme is built on. The ritual is ancient. The math is
        new. The combination is a kind of magic that wasn't possible even five years ago.
      </p>

      <h2>What's next</h2>

      <p>
        Tomorrow's time capsules will likely outlive us. They will be read by people
        we've never met, who will know us only by what we chose to preserve. They will
        not be physical vaults (which decay) or even company databases (which can be
        bought). They will be mathematical facts, sealed by cryptography and released
        by time.
      </p>

      <p>
        We are still early. The first digital time capsules are being sealed right now,
        by people who are about to find out who they were.
      </p>
    </>
  );
}
