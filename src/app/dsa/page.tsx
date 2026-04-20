import { redirect } from 'next/navigation';

export default function DSARedirect() {
    console.log('DSA Redirect page hit');
    redirect('/dsa/problems');
}
