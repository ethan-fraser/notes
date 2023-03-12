<script lang="ts">
  import { currentUser, pb } from "./pocketbase";

  let showLoginForm = true;

  let email: string;
  let password: string;
  let firstName: string;
  let lastName: string;
  let passwordConfirm: string;

  let firstNameError: string;
  let lastNameError: string;
  let emailError: string;
  let passwordError: string;
  let passwordConfirmError: string;

  function reset(values: boolean, errors: boolean) {
    if (values) {
      email = undefined;
      password = undefined;
      firstName = undefined;
      lastName = undefined;
      passwordConfirm = undefined;
    }
    if (errors) {
      emailError = undefined;
      passwordError = undefined;
      firstNameError = undefined;
      lastNameError = undefined;
      passwordConfirmError = undefined;
    }
  }

  function setShowLoginForm(show: boolean) {
    reset(true, true);
    showLoginForm = show;
  }

  async function login() {
    await pb
      .collection("users")
      .authWithPassword(email, password)
      .catch((err) => {
        passwordError = "Incorrect username or password.";
      });
  }

  async function signUp() {
    const data = {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    };
    await pb
      .collection("users")
      .create(data)
      .then((_) => {
        login().then(() => reset(true, true));
      })
      .catch((err) => {
        reset(false, true);
        firstNameError = err.data?.data?.firstName?.message ?? "";
        lastNameError = err.data?.data?.lastName?.message ?? "";
        passwordError = err.data?.data?.password?.message ?? "";
        emailError = err.data?.data?.email?.message ?? "";
        passwordConfirmError = err.data?.data?.passwordConfirm?.message ?? "";
      });
  }

  function signOut() {
    pb.authStore.clear();
    reset(true, true);
  }
</script>

<section>
  {#if $currentUser}
    <p>
      Signed in as {$currentUser.firstName}
      {$currentUser.lastName}
      <button on:click={signOut}>Sign out</button>
    </p>
  {:else if showLoginForm}
    <form on:submit|preventDefault>
      <input type="text" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button on:click={login}>Login</button>
      <span>{passwordError ?? ""}</span>
    </form>
    <span>
      Don't have an account?
      <button on:click={() => setShowLoginForm(false)}> Sign up </button>
    </span>
  {:else if !showLoginForm}
    <form on:submit|preventDefault>
      <span>
        <input
          class={firstNameError ? "erroredInput" : ""}
          type="text"
          placeholder="First name"
          bind:value={firstName}
          title={firstNameError ?? ""}
        />
        <input
          class={lastNameError ? "erroredInput" : ""}
          type="text"
          placeholder="Last name"
          bind:value={lastName}
          title={lastNameError ?? ""}
        />
      </span>
      <input
        class={emailError ? "erroredInput" : ""}
        type="text"
        placeholder="Email"
        bind:value={email}
        title={emailError ?? ""}
      />
      <input
        class={passwordError ? "erroredInput" : ""}
        type="password"
        placeholder="Password"
        bind:value={password}
        title={passwordError ?? ""}
      />
      <input
        class={passwordConfirmError ? "erroredInput" : ""}
        type="password"
        placeholder="Confirm password"
        bind:value={passwordConfirm}
        title={passwordConfirmError ?? ""}
      />
      <button on:click={signUp}>Sign up</button>
    </form>
    <span>
      Already have an account?
      <button on:click={() => setShowLoginForm(true)}>Login</button>
    </span>
  {/if}
</section>

<style>
  section * {
    margin: 5px;
  }

  span {
    margin: 0px;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  input {
    font-size: large;
    padding: 2px;
  }

  .erroredInput {
    border: 1px solid red;
    outline: 1px solid red;
    border-radius: 2px;
  }
</style>
