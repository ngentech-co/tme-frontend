export default function HowTimeLockWorks() {
  return (
    <>
      <p>
        When you seal a capsule on tomorrowme, we make a promise: nobody — not us, not an
        attacker, not a court order — can read it before the date you set. That promise is
        backed by a piece of mathematics called <em>identity-based encryption</em> (IBE),
        powered by a public network called Drand.
      </p>

      <p>
        This post walks through how it actually works, with no jargon left unexplained.
      </p>

      <h2>The setup</h2>

      <p>
        Imagine a lock that only opens at a specific moment in the future. Not a lock
        that someone has a key for and chooses to open early — a lock that <em>cannot be
        opened</em> until the network says it's time. That's what time-lock encryption
        gives you.
      </p>

      <h2>Three things you need to know</h2>

      <h3>1. Symmetric encryption: AES</h3>

      <p>
        AES is the workhorse of modern encryption. It's been the standard since 2001,
        is audited everywhere, and runs natively in your browser (we use AES-256-GCM).
        When you seal a capsule, your browser generates a fresh AES key, encrypts your
        message with it, and discards the key — except we don't just throw it away. We
        lock it.
      </p>

      <h3>2. Drand: a public randomness beacon</h3>

      <p>
        Drand is a network run by the <em>League of Entropy</em> — a consortium of
        sixteen organizations including Cloudflare, EPFL, and the University of Chile.
        Every minute, all sixteen of them run a distributed protocol that produces a
        fresh random number, signed collectively. Nobody can predict it; nobody can
        withhold it.
      </p>

      <p>
        The signature Drand produces at round N is unique to round N. It's published
        publicly on the Drand website, in JSON, for everyone to verify.
      </p>

      <h3>3. Identity-based encryption: the trick</h3>

      <p>
        In normal public-key encryption, anyone can encrypt with the public key, but
        only the holder of the private key can decrypt. In IBE, the <em>identity</em>
        (a string like "round-1234567") acts as the public key — and the matching
        private key is derived from the Drand signature at that round.
      </p>

      <p>
        In other words: Drand's signature at round N is the decryption key for anything
        encrypted against "round N" as an identity. Before that signature is
        published, no decryption is possible. After it's published, anyone holding the
        ciphertext can decrypt.
      </p>

      <h2>Putting it together</h2>

      <p>Here's the full pipeline when you seal a capsule:</p>

      <ol>
        <li>Your browser generates a fresh AES key <code>K</code>.</li>
        <li>Your message is encrypted with <code>K</code> into ciphertext <code>C</code>.</li>
        <li>We compute the target Drand round <code>R</code> from the date you chose.</li>
        <li><code>K</code> is encrypted against "round <code>R</code>" using IBE, producing <code>T</code>.</li>
        <li>The server stores <code>C</code> and <code>T</code>. It never sees <code>K</code>.</li>
      </ol>

      <p>
        On the unlock date, Drand publishes its signature for round <code>R</code>.
        Your browser fetches it, derives <code>K</code>, decrypts <code>T</code>, and
        uses <code>K</code> to decrypt <code>C</code>. The message is in your hands.
      </p>

      <h2>What this means for trust</h2>

      <p>
        The math says: as long as Drand publishes its signature on schedule (which it
        has, every minute, since 2019) and the AES algorithm holds (it has, for
        decades), nobody can read your message before the unlock date. Not us, not a
        government, not a future quantum computer that somehow gets a copy of every
        server we've ever run.
      </p>

      <p>
        That's the whole point. We are not the trusted party. The math is.
      </p>
    </>
  );
}
