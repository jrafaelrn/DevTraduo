import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BackendService } from 'src/app/service/backend.service';
import { Post } from '../../model/post'
import { Router, ActivatedRoute } from '@angular/router';
import { FlagDialogComponent } from '../../shared/components/flag-dialog/flag-dialog.component';
import { ShareDialogComponent } from 'src/app/shared/components/share-dialog/share-dialog.component';
import { PostService } from 'src/app/service/post.service';
import { Comment } from 'src/app/model/comment';
import { CommentService } from 'src/app/service/comment.service';
import { DialogCommentComponent } from 'src/app/shared/components/dialog-comment/dialog-comment.component';
import { Usuario } from 'src/app/model/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: Post = {
    id: 0,
    title: '',
    createdBy: '',
    language: '',
    description: '',
    categories: [],
    likes: 0
  }

  comment: Comment = {
    postId: 0,
    userLogin: '',
    content: '',
    type: '',
    postTitle: '',
    postUser: ''
  }

  translationList: Comment[] = []
  explanationList: Comment[] = []

  public liked: boolean = false;
  public disliked: boolean = false;

  filePath: string | undefined;
  flagPath: string | undefined;
  sharePath: string | undefined;
  commentPath: string | undefined;

  constructor(
    private backendService: BackendService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _postService: PostService,
    private commentService: CommentService,
    private snackBar:MatSnackBar
    ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {name: this.filePath},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.filePath = result;
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem("Usuario") == null) this.router.navigate(['login']);
    const id = this.route.snapshot.paramMap.get('id');

    this._postService.getPostById(Number.parseInt(id!)).subscribe((post) => {
      this.post = post
    })
    /*
    this._postService.getPostByUserId(localStorage.getItem("Usuario")!).subscribe(retorno => {
      let posts = retorno.posts;
      posts.forEach(element => {
        if(element.id == parseInt(id!)) this.post = element;
      });
    });
    */
    this.commentService.getComment().subscribe((commentList) => {
      this.translationList = commentList.filter(c => c.postId == Number.parseInt(id!) && c.type == 'Tradução')
      this.explanationList = commentList.filter(c => c.postId == Number.parseInt(id!) && c.type == 'Explicação')
    })
  }

  postLiked(event: MouseEvent){
    this.liked = true;
    this.disliked = false;
    this.post.likes++;
    this._postService.editarPosts(this.post.id, this.post).subscribe({
      next: data => {
        this.snackBar.open('Liked! :)', '', {duration: 3000});
      }
    });
  }
  
  postDisliked(){
    this.liked = false;
    this.disliked = true;
    this.post.likes--;
    this._postService.editarPosts(this.post.id, this.post).subscribe({
      next: data => {
        this.snackBar.open('Disliked! :(', '', {duration: 3000});
      }
    });
  }

  openCommentDialog(): void {
    sessionStorage.setItem('postID', this.post.id!.toString())
    sessionStorage.setItem('postTitle', this.post.title)
    sessionStorage.setItem('postUser', this.post.createdBy)
    const MatdialogRef = this.dialog.open(DialogCommentComponent, {
      width: '500px',
      data: {name: this.commentPath},
    });

    MatdialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.commentPath = result;
    });
  }

  openflagDialog(): void {
    const MatdialogRef = this.dialog.open(FlagDialogComponent, {
      width: '500px',
      data: {name: this.flagPath},
    });
  
    MatdialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.flagPath = result;
    });
  }

  openShareDialog(): void {
    const MatdialogRef = this.dialog.open(ShareDialogComponent, {
      width: '650px',
      height: '230px',
      data: {name: this.sharePath},
    });
  
    MatdialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.sharePath = result;
    });
  }

}

@Component({
  selector: 'attach-file-dialog',
  templateUrl: 'attach-file-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


