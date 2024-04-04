import {
  updateDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { fireDB } from "../firebaseConfig";
import {
  SetReadNotifications,
  SetUnreadNotifications,
} from "../redux/notificationsSlice";
import store from "../redux/store";

export const updateUserProfile = async (payload) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    await updateDoc(doc(fireDB, "users", user.id), payload);
    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const updateUserStatus = async (payload) => {
  try {
    await updateDoc(doc(fireDB, "users", payload.id), payload);
    return {
      success: true,
      message: "Status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const getUserProfile = async (id) => {
  try {
    const docRef = doc(fireDB, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data(),
      };
    } else {
      return {
        success: false,
        message: "No such user!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const users = [];
    const querySnapshot = await getDocs(collection(fireDB, "users"));
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const getUserNotifications = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const q = query(collection(fireDB, "users", user.id, "notifications"));
    onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      const readNotifications = notifications.filter(
        (notification) => notification.status === "read"
      );
      const unreadNotifications = notifications.filter(
        (notification) => notification.status === "unread"
      );
      store.dispatch(SetReadNotifications(readNotifications));
      store.dispatch(SetUnreadNotifications(unreadNotifications));
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const changeNotificationStatus = async (id, status) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    await updateDoc(doc(fireDB, "users", user.id, "notifications", id), {
      status,
    });
    return {
      success: true,
      message: "Notification status changed",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
