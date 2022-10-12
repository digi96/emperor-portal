import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Profile = () => {
  const { signed } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!signed) {
  //     router.push('/member/sign');
  //   }
  // }, [signed]);

  if (signed) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Bevis Lin</p>
      </div>
    );
  } else {
    return (
      <div>
        Address has no signature<br></br>
        <Link href={'/member/sign'}>
          <a className="link-primary">Sign here</a>
        </Link>
      </div>
    );
  }
};

export default Profile;
