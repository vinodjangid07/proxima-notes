import useAuth from "../context/useAuth";

const Profile = () => {
    const { currentUser } = useAuth();
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-12 flex justify-center text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
            {currentUser ?
                    (
                        <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 mt-12">
                            <div className="image rounded-full overflow-hidden">
                                <img src={currentUser.photoURL} alt={`${currentUser.displayName}'s Profile Image`} />
                            </div>
                            <div className="text-center flex flex-col gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">{currentUser.displayName}</h1>
                            </div>
                        </div>
                    ) : (
                        <>

                        </>
                    )
            }

        </div>
    )
}

export default Profile;
