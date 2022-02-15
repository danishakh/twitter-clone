import {
  ChartBarIcon,
  ShareIcon,
  ChatIcon,
  TrashIcon,
  HeartIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline'
import {
  DotsHorizontalIcon,
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from '@heroicons/react/solid'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '../atoms/modalAtom'
import {
  deleteDoc,
  setDoc,
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from '@firebase/firestore'
import { db } from '../firebase'

const Post = ({ id, post, postPage }) => {
  //console.log('inside post component', post)

  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useRecoilState(modalState)
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useRecoilState(postIdState)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState([])

  const router = useRouter()

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => {
          setComments(snapshot.docs)
        }
      ),
    [db]
  )

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  )

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.name,
      })
    }
  }

  return (
    <div
      className="flex cursor-pointer border-b border-gray-700 p-3"
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt="Profile Pic"
          className="mr-4 h-11 w-11 rounded-full"
        />
      )}
      <div className="flex w-full flex-col space-y-2">
        <div className={`flex ${!postPage && 'justify-between'}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile Pic"
              className="mr-4 h-11 w-11 rounded-full"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="group inline-block">
              <h4
                className={`text-[15px] font-bold text-[#d9d9d9] group-hover:underline sm:text-base ${
                  !postPage && 'inline-block'
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && 'ml-1.5'}`}
              >
                @{post?.tag}
              </span>
            </div>{' '}
            ·{' '}
            <span className="text-sm hover:underline sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="mt-0.5 text-[15px] text-[#d9d9d9] sm:text-base">
                {post?.text}
              </p>
            )}
          </div>
          <div className="icon group ml-auto flex-shrink-0">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {postPage && (
          <p className="mt-0.5 text-[15px] text-[#d9d9d9] sm:text-base">
            {post?.text}
          </p>
        )}
        <img
          src={post?.image}
          alt=""
          className="max-h-[700px] rounded-2xl object-cover"
        />

        <div
          className={`flex w-10/12 justify-between text-[#6e767d] ${
            postPage && 'mx-auto'
          }`}
        >
          {/* comment button */}
          <div
            className="group flex items-center space-x-1"
            onClick={(e) => {
              e.stopPropagation()
              setPostId(id)
              setIsOpen(true)
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="text-sm group-hover:text-[#1d9bf0]">
                {comments.length}
              </span>
            )}
          </div>

          {/* delete button */}
          {session.user.uid === post?.id ? (
            <div
              className="group flex items-center space-x-1"
              onClick={(e) => {
                e.stopPropagation()
                deleteDoc(doc(db, 'posts', id))
                router.push('/')
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="group flex items-center space-x-1">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          {/* like button */}
          <div
            className="group flex items-center space-x-1"
            onClick={(e) => {
              e.stopPropagation()
              likePost()
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`text-sm group-hover:text-pink-600 ${
                  liked && 'text-pink-600'
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {/* share button */}
          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>

          {/* chart button */}
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
